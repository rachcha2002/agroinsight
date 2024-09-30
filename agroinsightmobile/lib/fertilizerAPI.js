export const createFarmerFertilizer = async (form, setUploading, setForm) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/farmer/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }
  
      // Reset the form
      setForm({
        crop: "",
        fertilizer: "",
        amount: "",
      });
  
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setUploading(false);
    }
  };
  