"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Music, Star, Beaker } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Mic className="w-10 h-10 text-indigo-600" />,
      title: "Professional Training",
      description: "Personalized vocal coaching from experienced professionals"
    },
    {
      icon: <Music className="w-10 h-10 text-indigo-600" />,
      title: "Modern Techniques",
      description: "Learn the latest vocal techniques and styles"
    },
    {
      icon: <Star className="w-10 h-10 text-indigo-600" />,
      title: "Performance Ready",
      description: "Prepare for performances, recordings, and auditions"
    },
    {
      icon: <Beaker className="w-10 h-10 text-indigo-600" />,
      title: "Scientific Approach",
      description: "Voice training based on vocal science and pedagogy"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="section-title">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
          </div>
          <p className="text-xl text-gray-600">Expert Vocal Coaching in Berlin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6 rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 