const predefinedQuestions = [
  {
    questionNumber: '1',
    statements: [
      {
        statementText: 'Stays calm and can talk things out',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Focuses well on details',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Makes tough decisions, even if others don’t like them',
        category: {
          most: 'B',
          least: 'D',
        },
      },
      {
        statementText: 'Keeps calm in a crisis',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '2',
    statements: [
      {
        statementText: 'Able to quickly adjust to new situations',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Carefully follows detailed instructions',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Stays calm when faced with challenges',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Thinks and acts carefully when faced with emergencies',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '3',
    statements: [
      {
        statementText: 'Able to do difficult or unpleasant tasks',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Must find work fulfilling',
        category: {
          most: 'B',
          least: 'B',
        },
      },
      {
        statementText: 'Must obey rules',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Stays positive and outgoing',
        category: {
          most: 'B',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '4',
    statements: [
      {
        statementText: 'Must state opinions firmly',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Adapts and stays flexible',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Stays calm during tough times',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Be cheerful around others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '5',
    statements: [
      {
        statementText: 'Cares for and considers others',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Easily convinces and persuades others',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Gives credit to others, when deserved',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Uses intuition and creativity to solve problems',
        category: {
          most: 'B',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '6',
    statements: [
      {
        statementText: 'Must want to win',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Respects and considers others beliefs',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Be outgoing and social',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Creates harmony among teammates',
        category: {
          most: 'B',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '7',
    statements: [
      {
        statementText: 'Looks and acts professional',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Be willing to take risks',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Be tactful and diplomatic',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Stay ambitious but not overly aggressive',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },

  {
    questionNumber: '8',
    statements: [
      {
        statementText: 'Leads others',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Be kind and approachable',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Handles discomfort without complaining',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Speaks and acts with confidence',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },

  {
    questionNumber: '9',
    statements: [
      {
        statementText: 'Must be very energetic',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Handles routine tasks well',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Be friendly and social',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Follows strict rules and procedures',
        category: {
          most: 'C',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '10',
    statements: [
      {
        statementText: 'Makes tough decisions, even if unpopular',
        category: {
          most: 'D',
          least: 'B',
        },
      },
      {
        statementText: 'Inspires enthusiasm in others',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Accepts guidance from supervisors',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Understands complex data and information',
        category: {
          most: 'B',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '11',
    statements: [
      {
        statementText: 'Believe in yourself',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Recognize and respect others’ needs',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Be patient and tolerant',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Be strong and determined',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '12',
    statements: [
      {
        statementText: 'Express yourself clearly',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Accept that people make mistakes',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Works well alone when needed',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Accepts feedback from others',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '13',
    statements: [
      {
        statementText: 'Follows established rules',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Adapts quickly to change',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Feels connected to the organization',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Gets along well with others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '14',
    statements: [
      {
        statementText: 'Be open to new ideas and changes',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Helps others',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Stays determined',
        category: {
          most: 'B',
          least: 'D',
        },
      },
      {
        statementText: 'Keeps a sense of humor in tough situations',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '15',
    statements: [
      {
        statementText: 'Pays attention to details',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Always sticks to procedures',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Stands your ground when needed',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'See the funny side of situations',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '16',
    statements: [
      {
        statementText: 'Speaks fluently and confidently',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Play supporting role',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Follows established practices',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Makes decisions confidently',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '17',
    statements: [
      {
        statementText: 'Plans for unexpected situations',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Never gives up',
        category: {
          most: 'D',
          least: 'B',
        },
      },
      {
        statementText: 'Convinces and persuades others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Stays calm and stable',
        category: {
          most: 'S',
          least: 'B',
        },
      },
    ],
  },

  {
    questionNumber: '18',
    statements: [
      {
        statementText: 'Thinks before acting',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Be kind and thoughtful',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Explains ideas clearly',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Always competitive and driven',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '19',
    statements: [
      {
        statementText: 'Respects authority',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Thinks creatively and independently',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Believes in your own success',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Be willing to compromise',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },

  {
    questionNumber: '20',
    statements: [
      {
        statementText: 'Builds connections with new people',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Asks questions to learn more',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Stays very enegetic',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Be caring and understanding',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '21',
    statements: [
      {
        statementText: 'Look professional and well-groomed',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Respects those in authority',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: "Keeps trying, even when it's hard",
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Makes a good first impression',
        category: {
          most: 'B',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '22',
    statements: [
      {
        statementText: 'Works well in a team',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Wants to be accurate and attend to details',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Speaks up for what’s right',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Be trustworthy',
        category: {
          most: 'B',
          least: 'S',
        },
      },
    ],
  },

  {
    questionNumber: '23',
    statements: [
      {
        statementText: 'Takes responsibility for own actions',
        category: {
          most: 'D',
          least: 'B',
        },
      },
      {
        statementText: 'Makes first contact with others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Follows instructions without questioning',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Creates and improves rules and systems',
        category: {
          most: 'B',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '24',
    statements: [
      {
        statementText: 'Be prepared to trust others',
        category: {
          most: 'S',
          least: 'I',
        },
      },
      {
        statementText: 'Supports the current way of doing things',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Always positive and outgoing',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Maintains high standards',
        category: {
          most: 'C',
          least: 'C',
        },
      },
    ],
  },
];

export default predefinedQuestions;
