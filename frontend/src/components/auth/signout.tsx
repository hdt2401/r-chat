import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth";

const SignOut: React.FC = () => {
  const navigate = useNavigate()
  const authState = useAuthStore();

  const handleSignOut = async () => {
    await authState.signOut();
    navigate("/signin");
  }
  return (
    <Button onClick={handleSignOut}>Sign out</Button>
  );
}
export default SignOut;