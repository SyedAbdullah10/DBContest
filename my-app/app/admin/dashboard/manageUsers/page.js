"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logo from "@/app/Components/Logo";
import { Search, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

// Function to show toast for adding a user
const showAddToast = (duplicates) => {
  let msg = "";
  if (duplicates.length > 0) {
    msg =
      "Except these duplicates: " +
      duplicates.map((d) => JSON.stringify(d)).join(", ");
  }
  toast.success(`Users added successfully! ${msg}`, {
    position: "top-center", // Toast appears from the top-center
    autoClose: 5000, // Auto close after 5 seconds
    hideProgressBar: false, // Show progress bar
    closeOnClick: true, // Close on click
    pauseOnHover: true, // Pause when hovered
    draggable: false, // Enable dragging
  });
};

// Function to show toast for updating a user
const showUpdateToast = () => {
  toast.warning("User updated successfully!", {
    position: "top-center", // Toast appears from the top-center
    autoClose: 5000, // Auto close after 5 seconds
    hideProgressBar: false, // Show progress bar
    closeOnClick: true, // Close on click
    pauseOnHover: true, // Pause when hovered
    draggable: false, // Enable dragging
  });
};

// Function to show toast for deleting a user
const showDeleteToast = () => {
  toast.error("User deleted successfully!", {
    position: "top-center", // Toast appears from the top-center
    autoClose: 5000, // Auto close after 5 seconds
    hideProgressBar: false, // Show progress bar
    closeOnClick: true, // Close on click
    pauseOnHover: true, // Pause when hovered
    draggable: false, // Enable dragging
  });
};

const DialogField = ({
  fieldName,
  fieldType,
  field,
  setField,
  isDisabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-red-400">{fieldName}</label>
      <Input
        type={fieldType}
        value={field}
        onChange={(e) => setField(e.target.value)}
        placeholder={fieldName}
        disabled={isDisabled}
        className="bg-black/50 border border-red-500/40 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
};

const ManageUsers = () => {
  // States
  const [users, setUsers] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: null, username: "" });
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUsers, setNewUsers] = useState("");

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/user-CRUD");
      setUsers(response.data.users);
    } catch (err) {
      console.log("Error fetching users: ", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAddUser = () => {
    if (!newUsers) {
      return;
    }

    const mp = new Map();
    const all_users = [];
    const duplicates = [];

    // Populate the map with existing users
    users.forEach((user) => {
      mp.set(user.username, true);
    });

    // Split newUsers string into lines and process each user
    newUsers.split("\n").forEach((line) => {
      const parts = line.split(",").map((s) => s.trim()); // Split and trim spaces
      if (parts.length !== 3) return; // Ignore malformed lines

      const [username, name, password] = parts;

      if (mp.has(username)) {
        duplicates.push({ username, name, password, role: "user" });
      } else {
        all_users.push({ username, name, password, role: "user" });
        mp.set(username, true); // Mark as added
      }
    });

    console.log("All Users:", all_users);
    console.log("Duplicates:", duplicates);

    const addUsersToDB = async () => {
      try {
        const response = await axios.post("/api/user-CRUD", {
          all_users,
        });
        if (response.status == 200) {
          showAddToast(duplicates);
          getUsers();
          setIsAddDialogOpen(false);
          setNewUsers("");
        }
      } catch (err) {
        console.log("Error", err);
      }
    };

    addUsersToDB();
  };

  const handleRemove = (id) => {
    const deleteUser = async () => {
      try {
        const response = await axios.delete("/api/user-CRUD", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            all_users_ids: [id],
          },
        });
        if (response.status == 200) {
          setUsers(users.filter((user) => user.id !== id));
          showDeleteToast();
        }
      } catch (err) {
        console.log("Error while deleting: ", err);
      }
    };

    deleteUser();
  };

  const handleEdit = () => {
    const updateUser = async () => {
      try {
        const response = await axios.put("/api/user-CRUD", {
          id: selectedUser.id,
          newUsername,
          newPassword,
        });
        if (response.status == 200) {
          setSelectedUser({ id: null, username: "" });
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id
                ? { ...user, username: newUsername || user.username }
                : user
            )
          );
          setNewPassword("");
          setNewUsername("");
          setIsEditDialogOpen(false);
          showUpdateToast();
        }
      } catch (err) {
        console.log("Error while deleting: ", err);
      }
    };

    updateUser();
  };

  // Memoized filtered users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const openEditDialog = (user, id) => {
    setSelectedUser({
      username: user,
      id: id,
    });
    setNewUsername("");
    setNewPassword("");
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 rounded-lg">
      <header className="flex items-center mb-6 w-[82%] mx-auto">
        <Logo />
        <h1 className="text-4xl font-bold text-white">Manage Users</h1>
      </header>

      <div className="w-full flex items-center justify-center flex-col gap-4">
        <div className="w-[80%] flex gap-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-red-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 rounded-lg"
            placeholder="Search users..."
          />
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex gap-2 items-center px-4 py-5  bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            <Plus />
            Add Users
          </Button>
        </div>
        <div className="w-[80%] flex items-center justify-center overflow-hidden rounded-lg border border-red-500/30">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-red-500/20">
                <TableHead className="text-white text-left px-6 py-3">
                  Username
                </TableHead>
                <TableHead className="text-white text-left px-6 py-3">
                  Name
                </TableHead>
                <TableHead className="text-white px-6 py-3 text-end pr-[8.3rem]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? "bg-black/40" : "bg-black/20"
                  } transition hover:bg-black/60`}
                >
                  <TableCell className="text-white px-6 py-4">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-white px-6 py-4">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="destructive"
                        className="px-4 py-2 rounded-lg transition hover:bg-red-700"
                        onClick={() => handleRemove(user.id)}
                      >
                        Remove
                      </Button>
                      <Button
                        className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-lg transition hover:bg-red-500 hover:border-transparent"
                        onClick={() => openEditDialog(user.username, user.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/40 backdrop-blur-lg border border-red-500/30 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              Edit User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-white">
            <DialogField
              fieldName={"Current Username"}
              fieldType={"text"}
              field={selectedUser?.username}
              setField={setSelectedUser}
              isDisabled={true}
            />

            <DialogField
              fieldName={"New Username"}
              fieldType={"text"}
              field={newUsername}
              setField={setNewUsername}
            />

            <DialogField
              fieldName={"New Password"}
              fieldType={"password"}
              field={newPassword}
              setField={setNewPassword}
            />
          </div>
          <DialogFooter className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              className="border border-white text-black px-4 py-2 rounded-lg transition hover:bg-gray-300 hover:border-transparent"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-red-500 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
              onClick={handleEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} >
        <DialogContent className="bg-black/40 backdrop-blur-lg border w-[80rem] border-red-500/30 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              Add New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-white">
            <label className="text-sm text-red-400">
              Username, Name, Password
            </label>
            <Textarea
              type="text"
              value={newUsers}
              rows={8}
              onChange={(e) => setNewUsers(e.target.value)}
              placeholder={
                "Username1,Name1,Password1\nUsername2,Name2,Password2\nUsername3,Name3,Password3\n.\n.\n.\n"
              }
              className="bg-black/50 border border-red-500/40 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
              style={{ whiteSpace: "pre-line" }} // Allows multiline placeholders
            />
          </div>
          <DialogFooter className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              className="border border-white text-black px-4 py-2 rounded-lg transition hover:bg-gray-300 hover:border-transparent"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-green-500 text-white px-4 py-2 rounded-lg transition hover:bg-green-700"
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
