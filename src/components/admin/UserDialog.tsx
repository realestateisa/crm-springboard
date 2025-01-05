import { Profile } from "@/integrations/supabase/types/profiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: Partial<Profile>) => void;
  user?: Profile;
  mode: "edit" | "add";
}

const UserDialog = ({ open, onOpenChange, onSave, user, mode }: UserDialogProps) => {
  const [formData, setFormData] = useState<Partial<Profile>>(
    user || {
      first_name: "",
      last_name: "",
      email: "",
      role: "isa",
      is_active: true,
    }
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSave = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.email) {
        setError("Email is required");
        return;
      }
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
      if (!formData.first_name) {
        setError("First name is required");
        return;
      }
      if (!formData.last_name) {
        setError("Last name is required");
        return;
      }

      // Check if email exists (only for new users)
      if (mode === "add") {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.email)
          .single();

        if (existingUser) {
          setError("A user with this email already exists");
          return;
        }
      }

      onSave(formData);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit" : "Add"} User</DialogTitle>
          {error && (
            <DialogDescription className="text-red-500">
              {error}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.first_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.last_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role || "isa"}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as "admin" | "isa" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="isa">ISA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : mode === "edit" ? "Save Changes" : "Add User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;