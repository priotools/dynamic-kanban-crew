
import ProfileEditForm from "./ProfileEditForm";
import PersonalTaskList from "./PersonalTaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileView() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileEditForm />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <PersonalTaskList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
