import FormControl from '@mui/material/FormControl';
import {Input, InputLabel} from "@mui/material";
const Login: React.FC = () => {
    return(
    <div>
        <FormControl>
            <InputLabel htmlFor="my-input">Email address</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
        </FormControl>
        <FormControl>
            <InputLabel htmlFor="my-input">Password</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
        </FormControl>
    </div>
);
}
export default Login;