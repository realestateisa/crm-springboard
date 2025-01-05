import { AppSidebar } from "@/components/AppSidebar";

const Inbox = () => {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-semibold">Inbox</h1>
        </div>
      </main>
    </div>
  );
};

export default Inbox;