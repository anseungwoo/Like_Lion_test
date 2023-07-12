'use client';
import React from 'react';
// import projectMockData from "../../../mock-data/v0/projects.json";
import OneProjectThumb from './OneProjectThumb';
import { useTicketProjectList } from '@/context/contractContext';
import { Loding } from '@/compounds/Loding';

interface tikectAvailable {
  available: boolean;
}

function ProjectSlider({ available }: tikectAvailable) {
  const { projects } = useTicketProjectList();

  if (projects.length === 0) {
    return (
      <div className="project-wrapper ">
        <Loding></Loding>
      </div>
    );
  }

  return (
    <div className="project-wrapper ">
      {projects.map((oneProject, index) => {
        return oneProject ? (
          <OneProjectThumb
            key={oneProject.contract}
            contract={oneProject.contract}
            description={oneProject.description}
            title={oneProject.title}
            imgUrl={oneProject.imgUrl}
            tickets={oneProject.tickets}
          />
        ) : (
          <Loding></Loding>
        );
      })}
    </div>
  );
}

export default ProjectSlider;
