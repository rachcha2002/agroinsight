import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function generatePDF(crops, marketName) {
    let rows = crops.map(
      (crop) => `<tr><td>${crop.Crop_name}</td><td>Rs. ${crop.Price}</td></tr>`
    ).join('');
  
    let htmlContent = `
      <h1 style="text-align: center;">Today Price List  - ${marketName}</h1>
      <table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Crop Name</th>
            <th>Price per 1kg</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p>Report generated on: ${new Date().toLocaleString()}</p>
    `;
  
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('PDF generated at:', uri);
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert(`PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }