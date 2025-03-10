import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { useRouter } from "expo-router";
import ErrorModal from "@/components/ErrorModal";

// Define the shape of the context
interface AuthContextType {
    user: any;
    userData: any;
    setUserData: any;
    isAuthenticated: boolean | undefined;
    login: (username: string, password: string) => Promise<void>;
    evacueeApplication: (
        name: string, 
        role: string, 
        username: string, 
        password: string,
        address: string, 
        phone?: string,  // Make phone optional here
        email?: string, 
        headOfFamilyName?: string, 
        centerName?: string,
        centerID?: string,
        isPWD?: boolean, 
        pwdType?: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setIsAuthenticated(true);
        }, 3000);
    }, []);

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        const loadUser = async () => {
          const storedUser = await SecureStore.getItemAsync('userData');
          if (storedUser) {
            setUserData(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        };
        loadUser();
      }, []);
      

    const login = async (username: string, password: string) => {
        try {
          console.log("Acc: ", username, password);
          const API = process.env.EXPO_PUBLIC_API_KEY;
          const userData = { username, password };
          const response = await axios.post(`${API}/login-user`, userData);
          if (response.status === 200) {
            const userRole = response.data.role;
            await SecureStore.setItemAsync('userRole', userRole);
            // Save user data persistently
            await SecureStore.setItemAsync('userData', JSON.stringify(response.data.user));
            setUserData(response.data.user);
            setIsAuthenticated(true);
            console.log(response.data.role);
            router.replace('/tabs/homepage');
          } else {
            setModalMessage("Incorrect username or password.");
            setModalVisible(true);
          }
        } catch (error) {
          setModalMessage("Incorrect username or password.");
          setModalVisible(true);
        }
      };
      

    const evacueeApplication = async (
        name: string, 
        role: string, 
        username: string, 
        password: string,
        address: string,
        centerName?: string,
        centerID?: string,
        phone?: string, 
        email?: string, 
        headOfFamilyName?: string,
        isPWD?: boolean, 
        pwdType?: string
    ) => {
        try {
            console.log("Applying for evacuee:", name, role, username, password, address, centerName, centerID, phone, email, headOfFamilyName, isPWD, pwdType);
            const API = process.env.EXPO_PUBLIC_API_KEY;

            // Dynamic application data
            const applicationData = {
                name,
                role,
                username,
                password,
                address,
                centerName,
                centerID,
                contactInfo: {
                    phone, 
                    email
                },
                additionalDetails: {
                    headOfFamilyName, 
                    isPWD, 
                    pwdType
                }
            };

            // Sending the application data to the API
            const response = await axios.post(`${API}/evacuee-application`, applicationData);

            if (response.status === 200) {
                setUser(response.data); // Set user data to context
                await SecureStore.setItemAsync('userRole', response.data.role);
                router.replace('/tabs/homepage');
            } else {
                setModalMessage("Application failed. Please try again.");
                setModalVisible(true);
            }
        } catch (error) {
 
        }
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        await SecureStore.deleteItemAsync('userData');
        await SecureStore.deleteItemAsync('userRole');
        router.replace('/signIn');
      };
      

    const register = async (email: string, password: string, username: string) => {
        try {
            // registration logic
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, evacueeApplication, register, logout, userData, setUserData }}>
            {children}
            {/* Error Modal */}
            <ErrorModal visible={modalVisible} message={modalMessage} onClose={closeModal} />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth must be wrapped inside AuthContextProvider");
    }
    return value;
};
