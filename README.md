# 🚴‍♂️🏃‍♂️ Sports Tracker Activities Exporter ⤵️

Script to export all of your workout data (GPX files and photos) from [Sports-Tracker.com](https://www.sports-tracker.com/).

## Features
* Extracts all `.gpx` files and attached photos.
* Generates native download scripts for both **Windows** (Batch) and **Mac/Linux** (Bash).
* Automatically maps internal activity IDs to readable folder names (Run, Walk, Rollerblading, Hiking, etc.).
* The script runs locally in your browser and does not save, store, or share your session tokens.

---

## How to Export Your Workouts

### Step 1: Generate the Download Script
1. Log into your account at [sports-tracker.com/dashboard](https://www.sports-tracker.com/dashboard).
2. Open your browser's Developer Tools Console:
   * **Chrome/Edge/Firefox:** Press `F12` or `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac) and click the **Console** tab.
3. Copy the content from `ExportScript-bat.js` (for Windows) or `ExportScript-sh.js` (for Mac/Linux) and paste it into the browser console, then hit **Enter**.
4. The console will print out a large block of text. This is your custom download script!

### Step 2: Run the Download Script

#### 🪟 For Windows Users (Using `download.bat`)
*Copy the script generated in your browser console:*
1. Open **Notepad**.
2. Paste the generated code into Notepad.
3. Click `File` -> `Save As`.
4. In the "Save as type" dropdown, select **All Files (*.*)**.
5. Name the file `download.bat` and save it to an empty folder where you want your workouts to go.
6. **Double-click** `download.bat`. A black command window will appear and safely download all your workouts using Windows' built-in curl tool.

#### 🍏🐧 For Mac & Linux Users (Using `download.sh`)
*Copy the script generated in your browser console:*
1. Open a text editor and paste the generated code.
2. Save the file as `download-all-workouts.sh` in an empty folder.
3. Open your Terminal and navigate to that folder.
4. Make the script executable by running:
   ```bash
   chmod +x download-all-workouts.sh
