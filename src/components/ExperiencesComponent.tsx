import { Typography } from '@mui/material';
import PropsBase from './PropsBase';

const ExperiencesComponent = (props: PropsBase) => {
    return (
        <div style={ props.style } className="container">
            <Typography variant='h2'>Experiences</Typography>
        </div>
    )
}


export default ExperiencesComponent;