import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const defaultFAQs = [
  {
    title: "How to fix Bangla typing issues in Adobe Illustrator?",
    videoUrl: "https://www.youtube.com/watch?v=WikfQ87YKtc",
    description: "Guide for fixing Bangla typing issues in Adobe Illustrator",
    bulletPoints: [
      "Ensure you're using the correct Bangla font that supports Unicode encoding for proper character display.",
      "Check the 'Middle Eastern & South Asian' text engine option in the 'Preferences' settings panel.",
      "Set your keyboard input method to Bangla in your system settings."
    ],
    softwareType: "Adobe Illustrator"
  },
  {
    title: "How to resolve Bangla typing issues in Adobe Photoshop?",
    videoUrl: "https://www.youtube.com/watch?v=7s_s86g7xV4",
    description: "Guide for resolving Bangla typing issues in Adobe Photoshop",
    bulletPoints: [
      "Enable the 'Middle Eastern & South Asian' text engine in the 'Preferences' panel for proper text rendering.",
      "Use a Bangla-compatible font that supports OpenType features for optimal display.",
      "Verify your system's language settings to include proper Bangla input support."
    ],
    softwareType: "Adobe Photoshop"
  }
];

export const seedFAQs = async () => {
  try {
    // Check if FAQs already exist
    const faqsRef = collection(db, 'faqs');
    const snapshot = await getDocs(faqsRef);
    
    if (snapshot.empty) {
      // Add default FAQs if collection is empty
      const timestamp = Timestamp.now();
      
      for (const faq of defaultFAQs) {
        await addDoc(faqsRef, {
          ...faq,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      }
      
      console.log('Default FAQs added successfully');
    }
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  }
}; 