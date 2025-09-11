import ImageAnalysis from "@/components/ImageAnalysis";

const Assessment = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Damage Analysis</h1>
      <p className="text-gray-600 mb-8">Upload forensic images to generate a detailed structural damage report.</p>
      <ImageAnalysis />
    </div>
  );
};

export default Assessment;
