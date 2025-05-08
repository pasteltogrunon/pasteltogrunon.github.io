import React from "react";
import { projects } from "../data";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

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
            </Grid>
            ))}
            </Grid>
        </Box>
      </div>
    </section>
  );
}
