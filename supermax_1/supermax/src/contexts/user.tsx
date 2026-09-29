import { createContext, useContext, ReactNode, useState } from "react";

export type USERROLE = 
  | "Store Manager" 
  | "Inventory Admin" 
  | "Finance Manager" 

export type USERSTATE_VALIDATIONSTATE = "validated" | "pendingValidation";

export interface USERTYPE {
  username: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone: string;
  email: string | null;
  id_number: string;
  kra_pin: string;
  role: USERROLE;
  validation_state: USERSTATE_VALIDATIONSTATE;
  allowed_actions: string[];
}

export interface USER_EXTENDED {
  authentication_state: "idle" | "loading" | "validating" | "done";
  authentication_error: string | null;
  is_authenticated: boolean;
  login: (username: string, password: string, role: USERROLE) => void;
  logout: () => void;
  roles: USERROLE[];
  user: USERTYPE | null;
}

const UserContext = createContext<USER_EXTENDED | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authentication_state, set_authentication_state] = useState<"idle" | "loading" | "validating" | "done">("idle");
  const [is_authenticated, set_is_authenticated] = useState<boolean>(false);
  const [user, set_user] = useState<USERTYPE | null>(null);
  const [authentication_error, set_authentication_error] = useState<string | null>(null);

  const roles: USERROLE[] = [
    "Store Manager" 
  , "Inventory Admin" 
  , "Finance Manager" 
  ];
  

  // Simulates instant client-side login without any API backend call
  const login = (username: string, _password: string, role: USERROLE) => {
    set_authentication_state("validating");
    set_authentication_error(null);

    // Short simulated delay for smooth UX transition
    setTimeout(() => {
      const mockUser: USERTYPE = {
        username: username || "demo_user",
        first_name: username ? username.charAt(0).toUpperCase() + username.slice(1) : "Demo",
        middle_name: null,
        last_name: "User",
        phone: "+254 700 000000",
        email: `${username || "user"}@supermax.com`,
        id_number: "38920112",
        kra_pin: "A011928374Z",
        role: role || "storeManager",
        validation_state: "validated",
        allowed_actions: ["ALL_ACCESS"],
      };

      set_user(mockUser);
      set_is_authenticated(true);
      set_authentication_state("done");
    }, 300);
  };

  const logout = () => {
    set_user(null);
    set_is_authenticated(false);
    set_authentication_state("idle");
    set_authentication_error(null);
  };

  const value = {
    authentication_state,
    authentication_error,
    is_authenticated,
    login,
    logout,
    roles,
    user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser context must be used within a UserProvider");
  }
  return context;
};