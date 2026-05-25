import mongoose, { Schema, model, models } from 'mongoose';

const ExperienceSchema = new Schema({
  id: String,
  jobTitle: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: [String],
});

const EducationSchema = new Schema({
  id: String,
  degree: String,
  school: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String,
});

const SkillSchema = new Schema({
  id: String,
  name: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: false,
  },
});

const ProjectSchema = new Schema({
  id: String,
  title: String,
  description: String,
  url: String,
  technologies: [String],
});

const ResumeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Resume"
  },
  template: {
    type: String,
    default: 'modern',
  },
  personalInfo: {
    fullName: String,
    jobTitle: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    summary: String,
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  skills: [SkillSchema],
  projects: [ProjectSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

export const Resume = models.Resume || model('Resume', ResumeSchema);
