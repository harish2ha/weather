const apiKey = "f81bd9e8709c5113c89836b9871dde40";
const baseUrl = "https://api.weatherstack.com/current";

async function getWeather() {
  const city = document.getElementById("cityInput").value || "New Delhi";
  const url = `${baseUrl}?access_key=${apiKey}&query=${encodeURIComponent(
    city
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      alert("City not found!");
      return;
    }

    // Update current weather
    document.getElementById("cityName").textContent = data.location.name;
    document.getElementById(
      "temperature"
    ).textContent = `${data.current.temperature}°C`;
    document.getElementById("description").textContent =
      data.current.weather_descriptions[0];
    document.getElementById("weatherIcon").src = data.current.weather_icons[0];
    document.getElementById(
      "humidity"
    ).textContent = `${data.current.humidity}%`;
    document.getElementById(
      "windSpeed"
    ).textContent = `${data.current.wind_speed} km/h`;
    document.getElementById(
      "feelsLike"
    ).textContent = `${data.current.feelslike}°C`;
    document.getElementById("uvIndex").textContent = data.current.uv_index;

    // Simulate 5-day forecast (WeatherStack free tier doesn't provide forecast)
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    for (let i = 0; i < 5; i++) {
      const forecastDay = document.createElement("div");
      forecastDay.className = "forecast-day";
      forecastDay.innerHTML = `
                        <div>${days[i]}</div>
                        <img src="${
                          data.current.weather_icons[0]
                        }" alt="Weather Icon">
                        <div>${data.current.temperature - i}°C</div>
                        <div>${data.current.weather_descriptions[0]}</div>
                    `;
      forecastContainer.appendChild(forecastDay);
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Error fetching weather data!");
  }
}

// Load default weather on page load
window.onload = getWeather;

var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
  return cell !== "" && cell != null;
}
function loadFileData(filename) {
  if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
    try {
      var workbook = XLSX.read(gk_fileData[filename], { type: "base64" });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON to filter blank rows
      var jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: "",
      });
      // Filter out blank rows (rows where all cells are empty, null, or undefined)
      var filteredData = jsonData.filter((row) => row.some(filledCell));

      // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
      var headerRowIndex = filteredData.findIndex(
        (row, index) =>
          row.filter(filledCell).length >=
          filteredData[index + 1]?.filter(filledCell).length
      );
      // Fallback
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }

      // Convert filtered JSON back to CSV
      var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
      csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
      return csv;
    } catch (e) {
      console.error(e);
      return "";
    }
  }
  return gk_fileData[filename] || "";
}
