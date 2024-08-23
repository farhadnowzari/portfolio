import PropsBase from './PropsBase';
import { Link, Typography } from '@mui/material';

const AboutMeComponent = (props: PropsBase) => {
    return (
        <div style={props.style} className="container">
            <Typography variant='h2'>About Me</Typography>
            <br />
            <Typography fontSize={20} paragraph>
                All the skills and knowledge I have gathered all these years could not be possible
                without a passion for continuous learning and improvement.
                I had the chance to be surrounded by really talented individuals from different parts of
                the world to understand different mindsets and point of views and of course value a
                constructive environment.
            </Typography>
            <Typography fontSize={20} paragraph>
                In any company or projects I have participated in, I have always tried to leave a
                footprint and make sure all my colleagues even without me can still continue and be
                successful. In the past five years, I have been focusing on developing enterprise level
                products. This has made me more patient and careful while I still am courageous
                enough to try something new and make sure the code base or product will not suffer
                deprecation in the short term. In short, I still can have a lot of fun while maintaining or
                migrating or building a product.
            </Typography>
            <Typography fontSize={20} paragraph>
                I have never limited myself only to the company I have worked with. I also enjoy
                contributing to the community and helping others improve. My latest example for this
                which is also something I am really proud of is <strong>Neo4j.Berries.OGM</strong> which is an
                object-graph-mapper for neo4j in dotnet. This passion comes from love/talent or
                whatever society calls it, I deeply enjoy solving problems and providing for my team.
                With all this being said, I look forward to meeting you and having a great conversation
                together!
            </Typography>
            <Typography fontSize={20}>
                Cheers,<br />
                Farhad ❤️
            </Typography>
        </div>
    )
}

export default AboutMeComponent;