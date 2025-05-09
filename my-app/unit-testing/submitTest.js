const request = require("supertest");
const axios = require("axios");

describe("POST /api/evaluate", () => {
  it("should return correct result for a valid SQL", async () => {
    const response = axios.post("http://localhost/api/evaluate", {
      user_id: "1e351853-322c-44f2-a3f9-39d567011032",
      username: "hamza",
      contest_id: "fd379e26-1c41-4968-87d5-34ff68abc7f7",
      question_id: "6c3a1f61-7ea5-4783-8ec8-6826a487afb4",
      questionNumber: "Q4",
      submitted_at: new Date().toISOString(),
      sql_mode: "postgresql",
      user_answer: `SELECT
    d.department_name,
    SUM(s.amount) AS total_salary
FROM 
    departments d
JOIN 
    employees e ON d.department_id = e.department_id
JOIN 
    salaries s ON e.employee_id = s.employee_id
GROUP BY 
    d.department_id, d.department_name
ORDER BY 
    d.department_id ASC;
",
      ddl: "-- Create departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);
-- Create projects table
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
-- Create employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
-- Create salaries table
CREATE TABLE salaries (
    salary_id INT PRIMARY KEY,
    employee_id INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
-- Create assignments table
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY,
    employee_id INT,
    project_id INT,
    hours_worked INT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);
-- departments
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Engineering'),
(2, 'Human Resources'),
(3, 'Marketing'),
(4, 'Sales'),
(5, 'Finance');
-- projects
INSERT INTO projects (project_id, project_name, department_id) VALUES
(1001, 'Project Apollo', 1),
(1002, 'Project Zeus', 2),
(1003, 'Project Hera', 3),
(1004, 'Project Poseidon', 4),
(1005, 'Project Athena', 5),
(1006, 'Project Ares', 1),
(1007, 'Project Hermes', 2),
(1008, 'Project Artemis', 3),
(1009, 'Project Hades', 4),
(1010, 'Project Dionysus', 5);
-- employees
INSERT INTO employees (employee_id, first_name, last_name, department_id) VALUES
(200, 'Ivan', 'Davis', 1),
(201, 'David', 'Smith', 3),
(202, 'Ivan', 'Brown', 4),
(203, 'Eve', 'Moore', 2),
(204, 'Bob', 'Johnson', 3),
(205, 'Heidi', 'Brown', 4),
(206, 'Carol', 'Taylor', 2),
(207, 'Bob', 'Anderson', 2),
(208, 'David', 'Johnson', 5),
(209, 'Frank', 'Smith', 4),
(210, 'Eve', 'Brown', 1),
(211, 'Carol', 'Davis', 1),
(212, 'Alice', 'Smith', 5),
(213, 'Grace', 'Anderson', 4),
(214, 'Heidi', 'Taylor', 3),
(215, 'Frank', 'Moore', 2),
(216, 'Heidi', 'Anderson', 4),
(217, 'Bob', 'Miller', 3),
(218, 'Heidi', 'Moore', 5),
(219, 'Bob', 'Johnson', 3);
-- salaries
INSERT INTO salaries (salary_id, employee_id, amount) VALUES
(300, 200, 76318),
(301, 201, 52054),
(302, 202, 86135),
(303, 203, 67652),
(304, 204, 89656),
(305, 205, 58590),
(306, 206, 74757),
(307, 207, 77065),
(308, 208, 79422),
(309, 209, 87811),
(310, 210, 54808),
(311, 211, 88826),
(312, 212, 76592),
(313, 213, 89474),
(314, 214, 67938),
(315, 215, 63901),
(316, 216, 51965),
(317, 217, 69426),
(318, 218, 53046),
(319, 219, 87147);
-- assignments
INSERT INTO assignments (assignment_id, employee_id, project_id, hours_worked) VALUES
(400, 200, 1001, 57),
(401, 201, 1002, 127),
(402, 202, 1003, 53),
(403, 203, 1004, 149),
(404, 204, 1005, 129),
(405, 205, 1006, 149),
(406, 206, 1007, 117),
(407, 207, 1008, 146),
(408, 208, 1009, 127),
(409, 209, 1010, 139),
(410, 210, 1001, 143),
(411, 211, 1002, 141),
(412, 212, 1003, 117),
(413, 213, 1004, 66),
(414, 214, 1005, 137),
(415, 215, 1006, 78),
(416, 216, 1007, 132),
(417, 217, 1008, 132),
(418, 218, 1009, 81),
(419, 219, 1010, 147)`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
  });

  it("should return incorrect for wrong SQL", async () => {
    const response = axios.post("http://localhost/api/evaluate", {
      user_id: "0d677609-9af1-4404-83db-42f398048768",
      username: "umar",
      contest_id: "fd379e26-1c41-4968-87d5-34ff68abc7f7",
      question_id: "6c3a1f61-7ea5-4783-8ec8-6826a487afb4",
      questionNumber: "Q4",
      submitted_at: new Date().toISOString(),
      sql_mode: "postgresql",
      user_answer: `SELECT
    d.department_id,
    d.department_name,
    SUM(s.amount) AS total_salary
FROM 
    departments d
JOIN 
    employees e ON d.department_id = e.department_id
JOIN 
    salaries s ON e.employee_id = s.employee_id
GROUP BY 
    d.department_id, d.department_name
ORDER BY 
    d.department_id ASC;
",
      ddl: "-- Create departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);
-- Create projects table
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
-- Create employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
-- Create salaries table
CREATE TABLE salaries (
    salary_id INT PRIMARY KEY,
    employee_id INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
-- Create assignments table
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY,
    employee_id INT,
    project_id INT,
    hours_worked INT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);
-- departments
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Engineering'),
(2, 'Human Resources'),
(3, 'Marketing'),
(4, 'Sales'),
(5, 'Finance');
-- projects
INSERT INTO projects (project_id, project_name, department_id) VALUES
(1001, 'Project Apollo', 1),
(1002, 'Project Zeus', 2),
(1003, 'Project Hera', 3),
(1004, 'Project Poseidon', 4),
(1005, 'Project Athena', 5),
(1006, 'Project Ares', 1),
(1007, 'Project Hermes', 2),
(1008, 'Project Artemis', 3),
(1009, 'Project Hades', 4),
(1010, 'Project Dionysus', 5);
-- employees
INSERT INTO employees (employee_id, first_name, last_name, department_id) VALUES
(200, 'Ivan', 'Davis', 1),
(201, 'David', 'Smith', 3),
(202, 'Ivan', 'Brown', 4),
(203, 'Eve', 'Moore', 2),
(204, 'Bob', 'Johnson', 3),
(205, 'Heidi', 'Brown', 4),
(206, 'Carol', 'Taylor', 2),
(207, 'Bob', 'Anderson', 2),
(208, 'David', 'Johnson', 5),
(209, 'Frank', 'Smith', 4),
(210, 'Eve', 'Brown', 1),
(211, 'Carol', 'Davis', 1),
(212, 'Alice', 'Smith', 5),
(213, 'Grace', 'Anderson', 4),
(214, 'Heidi', 'Taylor', 3),
(215, 'Frank', 'Moore', 2),
(216, 'Heidi', 'Anderson', 4),
(217, 'Bob', 'Miller', 3),
(218, 'Heidi', 'Moore', 5),
(219, 'Bob', 'Johnson', 3);
-- salaries
INSERT INTO salaries (salary_id, employee_id, amount) VALUES
(300, 200, 76318),
(301, 201, 52054),
(302, 202, 86135),
(303, 203, 67652),
(304, 204, 89656),
(305, 205, 58590),
(306, 206, 74757),
(307, 207, 77065),
(308, 208, 79422),
(309, 209, 87811),
(310, 210, 54808),
(311, 211, 88826),
(312, 212, 76592),
(313, 213, 89474),
(314, 214, 67938),
(315, 215, 63901),
(316, 216, 51965),
(317, 217, 69426),
(318, 218, 53046),
(319, 219, 87147);
-- assignments
INSERT INTO assignments (assignment_id, employee_id, project_id, hours_worked) VALUES
(400, 200, 1001, 57),
(401, 201, 1002, 127),
(402, 202, 1003, 53),
(403, 203, 1004, 149),
(404, 204, 1005, 129),
(405, 205, 1006, 149),
(406, 206, 1007, 117),
(407, 207, 1008, 146),
(408, 208, 1009, 127),
(409, 209, 1010, 139),
(410, 210, 1001, 143),
(411, 211, 1002, 141),
(412, 212, 1003, 117),
(413, 213, 1004, 66),
(414, 214, 1005, 137),
(415, 215, 1006, 78),
(416, 216, 1007, 132),
(417, 217, 1008, 132),
(418, 218, 1009, 81),
(419, 219, 1010, 147)`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", false);
  });

  it("should return error for bad SQL syntax", async () => {
    const response = axios.post("http://localhost/api/evaluate", {
      user_id: "0d677609-9af1-4404-83db-42f398048768",
      username: "umar",
      contest_id: "fd379e26-1c41-4968-87d5-34ff68abc7f7",
      question_id: "6c3a1f61-7ea5-4783-8ec8-6826a487afb4",
      questionNumber: "Q4",
      submitted_at: new Date().toISOString(),
      sql_mode: "postgresql",
      user_answer: `SELECTT
    d.department_id,
    d.department_name,
    SUM(s.amount) AS total_salary
FROM 
    departments d
JOIN 
    employees e ON d.department_id = e.department_id
JOIN 
    salaries s ON e.employee_id = s.employee_id
GROUP BY 
    d.department_id, d.department_name
ORDER BY 
    d.department_id ASC;
",
      ddl: "-- Create departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);
-- Create projects table
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
-- Create employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
-- Create salaries table
CREATE TABLE salaries (
    salary_id INT PRIMARY KEY,
    employee_id INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
-- Create assignments table
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY,
    employee_id INT,
    project_id INT,
    hours_worked INT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);
-- departments
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Engineering'),
(2, 'Human Resources'),
(3, 'Marketing'),
(4, 'Sales'),
(5, 'Finance');
-- projects
INSERT INTO projects (project_id, project_name, department_id) VALUES
(1001, 'Project Apollo', 1),
(1002, 'Project Zeus', 2),
(1003, 'Project Hera', 3),
(1004, 'Project Poseidon', 4),
(1005, 'Project Athena', 5),
(1006, 'Project Ares', 1),
(1007, 'Project Hermes', 2),
(1008, 'Project Artemis', 3),
(1009, 'Project Hades', 4),
(1010, 'Project Dionysus', 5);
-- employees
INSERT INTO employees (employee_id, first_name, last_name, department_id) VALUES
(200, 'Ivan', 'Davis', 1),
(201, 'David', 'Smith', 3),
(202, 'Ivan', 'Brown', 4),
(203, 'Eve', 'Moore', 2),
(204, 'Bob', 'Johnson', 3),
(205, 'Heidi', 'Brown', 4),
(206, 'Carol', 'Taylor', 2),
(207, 'Bob', 'Anderson', 2),
(208, 'David', 'Johnson', 5),
(209, 'Frank', 'Smith', 4),
(210, 'Eve', 'Brown', 1),
(211, 'Carol', 'Davis', 1),
(212, 'Alice', 'Smith', 5),
(213, 'Grace', 'Anderson', 4),
(214, 'Heidi', 'Taylor', 3),
(215, 'Frank', 'Moore', 2),
(216, 'Heidi', 'Anderson', 4),
(217, 'Bob', 'Miller', 3),
(218, 'Heidi', 'Moore', 5),
(219, 'Bob', 'Johnson', 3);
-- salaries
INSERT INTO salaries (salary_id, employee_id, amount) VALUES
(300, 200, 76318),
(301, 201, 52054),
(302, 202, 86135),
(303, 203, 67652),
(304, 204, 89656),
(305, 205, 58590),
(306, 206, 74757),
(307, 207, 77065),
(308, 208, 79422),
(309, 209, 87811),
(310, 210, 54808),
(311, 211, 88826),
(312, 212, 76592),
(313, 213, 89474),
(314, 214, 67938),
(315, 215, 63901),
(316, 216, 51965),
(317, 217, 69426),
(318, 218, 53046),
(319, 219, 87147);
-- assignments
INSERT INTO assignments (assignment_id, employee_id, project_id, hours_worked) VALUES
(400, 200, 1001, 57),
(401, 201, 1002, 127),
(402, 202, 1003, 53),
(403, 203, 1004, 149),
(404, 204, 1005, 129),
(405, 205, 1006, 149),
(406, 206, 1007, 117),
(407, 207, 1008, 146),
(408, 208, 1009, 127),
(409, 209, 1010, 139),
(410, 210, 1001, 143),
(411, 211, 1002, 141),
(412, 212, 1003, 117),
(413, 213, 1004, 66),
(414, 214, 1005, 137),
(415, 215, 1006, 78),
(416, 216, 1007, 132),
(417, 217, 1008, 132),
(418, 218, 1009, 81),
(419, 219, 1010, 147)`,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
  });
});
