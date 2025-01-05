import { UserManagement } from "@/components/admin/UserManagement";

export default function Admin() {
  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1 flex flex-col min-w-0 md:ml-[16rem]">
        <div className="flex-1 p-6">
          <UserManagement />
        </div>
      </main>
    </div>
  );
}