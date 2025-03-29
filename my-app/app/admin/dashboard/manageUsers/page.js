// "use client";

// import React, { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Logo from "@/app/Components/Logo";
// import { Search } from "lucide-react";

// const initialUsers = [
//   { id: 1, username: "john_doe" },
//   { id: 2, username: "jane_smith" },
//   { id: 3, username: "alice_wonder" },
// ];

// const DialogField = ({
//   fieldName,
//   fieldType,
//   field,
//   setField,
//   isDisabled = false,
// }) => {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm text-red-400">{fieldName}</label>
//       <Input
//         type={fieldType}
//         value={field}
//         onChange={(e) => setField(e.target.value)}
//         placeholder={fieldName}
//         disabled={isDisabled}
//         className="bg-black/50 border border-red-500/40 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
//       />
//     </div>
//   );
// };

// const ManageUsers = () => {
//   const [users, setUsers] = useState(initialUsers);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState({ id: null, username: "" });
//   const [newUsername, setNewUsername] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   // New state for search
//   const [searchQuery, setSearchQuery] = useState("");

//   // Memoized filtered users based on search query
//   const filteredUsers = useMemo(() => {
//     return users.filter((user) =>
//       user.username.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [users, searchQuery]);

//   const openEditDialog = (user) => {
//     setSelectedUser(user);
//     setNewUsername("");
//     setCurrentPassword("");
//     setNewPassword("");
//     setIsDialogOpen(true);
//   };

//   const handleSave = () => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user.id === selectedUser.id
//           ? { ...user, username: newUsername || user.username }
//           : user
//       )
//     );
//     setIsDialogOpen(false);
//     console.log(newUsername, currentPassword, newPassword);
//   };

//   const handleRemove = (id) => {
//     setUsers(users.filter((user) => user.id !== id));
//   };

//   const handleSearch = () => {
//     // This function can be expanded if you want to do anything special on search
//     // Currently, the filtering is handled by the useMemo hook
//   };

//   return (
//     <div className="p-6 rounded-lg">
//       <header className="flex items-center mb-6 justify-center">
//         <Logo />
//         <h1 className="text-4xl font-bold text-white">Manage Users</h1>
//       </header>

//       <div className="w-full flex items-center justify-center flex-col gap-4">
//         <div className="w-[80%] flex gap-3">
//           <input
//             type="search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 bg-transparent border border-red-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 rounded-lg"
//             placeholder="Search users..."
//           />
//           <button
//             onClick={handleSearch}
//             className="flex gap-2 items-center px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
//           >
//             <Search />
//             Search
//           </button>
//         </div>
//         <div className="w-[80%] flex items-center justify-center overflow-hidden rounded-lg border border-red-500/30">
//           <Table className="w-full">
//             <TableHeader>
//               <TableRow className="bg-red-500/20">
//                 <TableHead className="text-white text-left px-6 py-3">
//                   Username
//                 </TableHead>
//                 <TableHead className="text-white px-6 py-3 text-end pr-[8.3rem]">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.map((user, index) => (
//                 <TableRow
//                   key={user.id}
//                   className={`${
//                     index % 2 === 0 ? "bg-black/40" : "bg-black/20"
//                   } transition hover:bg-black/60`}
//                 >
//                   {/* Username Column */}
//                   <TableCell className="text-white px-6 py-4">
//                     {user.username}
//                   </TableCell>

//                   {/* Actions Column (Moved to the end) */}
//                   <TableCell className="px-6 py-4 text-right">
//                     <div className="flex justify-end space-x-3">
//                       <Button
//                         variant="destructive"
//                         className="px-4 py-2 rounded-lg transition hover:bg-red-700"
//                         onClick={() => handleRemove(user.id)}
//                       >
//                         Remove
//                       </Button>
//                       <Button
//                         className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-lg transition hover:bg-red-500 hover:border-transparent"
//                         onClick={() => openEditDialog(user)}
//                       >
//                         Edit
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       {/* Edit User Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="bg-black/40 backdrop-blur-lg border border-red-500/30 shadow-xl rounded-lg">
//           <DialogHeader>
//             <DialogTitle className="text-white text-center text-2xl">
//               Edit User
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 text-white">
//             <DialogField
//               fieldName={"Current Username"}
//               fieldType={"text"}
//               field={selectedUser?.username}
//               setField={setSelectedUser}
//               isDisabled={true}
//             />

//             <DialogField
//               fieldName={"New Username"}
//               fieldType={"text"}
//               field={newUsername}
//               setField={setNewUsername}
//             />

//             <DialogField
//               fieldName={"Current Password"}
//               fieldType={"password"}
//               field={currentPassword}
//               setField={setCurrentPassword}
//             />

//             <DialogField
//               fieldName={"New Password"}
//               fieldType={"password"}
//               field={newPassword}
//               setField={setNewPassword}
//             />
//           </div>
//           <DialogFooter className="flex justify-end space-x-3 mt-4">
//             <Button
//               variant="outline"
//               className="border border-white text-black px-4 py-2 rounded-lg transition hover:bg-gray-300 hover:border-transparent"
//               onClick={() => setIsDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="default"
//               className="bg-red-500 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
//               onClick={handleSave}
//             >
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManageUsers;

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

const initialUsers = [
  { id: 1, username: "john_doe" },
  { id: 2, username: "jane_smith" },
  { id: 3, username: "alice_wonder" },
];

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
  const [users, setUsers] = useState(initialUsers);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: null, username: "" });
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUsers, setNewUsers] = useState("");

  // Memoized filtered users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setNewUsername("");
    setCurrentPassword("");
    setNewPassword("");
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, username: newUsername || user.username }
          : user
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleAddUser = () => {
    // Validate inputs
    if (!addUsername || !addPassword) {
      alert("Please enter both username and password");
      return;
    }

    // Check for duplicate username
    const isDuplicate = users.some(
      (user) => user.username.toLowerCase() === addUsername.toLowerCase()
    );

    if (isDuplicate) {
      alert("Username already exists");
      return;
    }

    // Add new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username: addUsername,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    // Reset add user form
    setAddUsername("");
    setAddPassword("");
    setIsAddDialogOpen(false);
  };

  const handleRemove = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 rounded-lg">
      <header className="flex items-center mb-6 justify-center">
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
                        onClick={() => openEditDialog(user)}
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
              fieldName={"Current Password"}
              fieldType={"password"}
              field={currentPassword}
              setField={setCurrentPassword}
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
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/40 backdrop-blur-lg border border-red-500/30 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              Add New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-white">
            <label className="text-sm text-red-400">Username, Password</label>
            <Textarea
              type="text"
              value={newUsers}
              rows={8}
              onChange={(e) => setNewUsers(e.target.value)}
              placeholder={"Username1, Password1\nUsername2, Password2\nUsername3, Password3\n.\n.\n.\n"}
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
