import Image from 'next/image';

// If using next/image
<Image 
  src="/logo.png"
  alt="Logo"
  width={100} // Set both width and height
  height={100}
  style={{ width: 'auto', height: 'auto' }} // Maintain aspect ratio
/> 