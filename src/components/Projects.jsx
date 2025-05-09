import React from "react";
import { projects } from "../data";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#17181b',
  ...theme.typography.body2,
  padding: theme.spacing(5),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#17181b',
  }),
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default function Projects() {
  return (
    <section id="projects" className="sildes">
      <div>
        <div>
          <h1>
            Check out my work
          </h1>
          <p>
            Here are some of my favorite projects:
          </p>
        </div>
        <Box sx={{ width: '100%' }} padding={4}>
            <Grid container spacing={12} justifyContent="center">
            {projects.map((project) => (
                <Grid size = {{ xs: 12, sm: 6, md: 4 }}>
                  <BootstrapTooltip title={project.description} arrow placement="bottom" slots={{transition: Fade,}}>
                    <a
                        href={project.link}
                        key={project.image}>
                        <div>
                        <img
                            alt="image"
                            src={project.image}
                        />
                        <div>
                            <h2>
                            {project.subtitle}
                            </h2>
                            <h1>
                            {project.title}
                            </h1>
                        </div>
                        </div>
                    </a>

                  </BootstrapTooltip>
            </Grid>
            ))}
            </Grid>
        </Box>
      </div>
    </section>
  );
}
