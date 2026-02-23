import UserList from "./UserList";

export default function Sidebar() {
  return (
    <div className="w-80 bg-white border-r hidden md:flex flex-col">
      <div className="p-4 font-bold text-lg border-b">
        Users
      </div>

      <UserList />
    </div>
  );
}