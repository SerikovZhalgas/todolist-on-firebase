import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

export const Loading = () => {
    return (
        <Container>
            <Grid container
                  style={{height: window.innerHeight - 50}}
                  alignItems={"center"}
                  justify={"center"}
            >
                <Grid
                    container
                    alignItems={"center"}
                    direction={"column"}
                >
                    <div className="lds-hourglass"></div>
                </Grid>
            </Grid>
        </Container>
    );
};