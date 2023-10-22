import { useDispatch } from "react-redux";
import { signOut } from "../stores/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const SignOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(signOut());
        navigate("/");

    })
    return (
        <div>
            Loading...
        </div>
    );
};

export default SignOut;
