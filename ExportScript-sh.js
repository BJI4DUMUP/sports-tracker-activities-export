(async function() {
    const key = "sessionkey=";
    const valueStartIndex = document.cookie.indexOf(key);
    if (valueStartIndex === -1) {
        console.error("Session key not found in cookies! Make sure you are logged in.");
        return;
    }
    const tokenStart = valueStartIndex + key.length;
    let tokenEnd = document.cookie.indexOf(';', tokenStart);
    if (tokenEnd === -1) tokenEnd = document.cookie.length;
    const token = document.cookie.substring(tokenStart, tokenEnd);

    // Expanded dictionary of known Sports-Tracker activity IDs
    const activities = {
        0: "walk",
        1: "run",
        2: "ride",
        11: "hike",
        12: "rollerblading",
        13: "alpineski",
        14: "rowing",
        15: "indoor-rowing",
        22: "trail-running",
        34: "tennis",
        75: "padel",
        99: "gravel-cycling"
    };

    console.log("Fetching list of all workouts via API...");
    const workoutsUrl = `https://api.sports-tracker.com/apiserver/v1/workouts?limit=100000&token=${token}`;
    
    try {
        const workoutsResponse = await fetch(workoutsUrl);
        if (!workoutsResponse.ok) {
            console.error("Failed to fetch workouts:", workoutsResponse.statusText);
            return;
        }

        const workoutsData = await workoutsResponse.json();
        const workouts = workoutsData.payload ? workoutsData.payload : workoutsData;

        if (!Array.isArray(workouts)) {
            console.error("Could not parse workouts list. API format might have changed.");
            console.log(workoutsData);
            return;
        }

        console.log(`Found ${workouts.length} workouts. Generating Mac/Linux Bash script...`);

        let bashScript = "#!/bin/bash\n\n";

        for (let i = 0; i < workouts.length; i++) {
            const w = workouts[i];
            const id = w.workoutKey;
            if (!id) continue;

            const activityId = w.activityId;
            const activityName = activities[activityId] || `activity-${activityId}`;
            const title = (w.description || "workout").replace(/[/\\?%*:|"<>]/g, '-').replace(/\n/g, ' ');
            const gpxUrl = `https://api.sports-tracker.com/apiserver/v1/workout/exportGpx/${id}?token=${token}`;
            const filename = `id--${id}--activity--${activityName}--title--${title}--file.gpx`;

            bashScript += `mkdir -p "${id}"\n`;
            bashScript += `curl -s -o "${id}/${filename}" "${gpxUrl}"\n`;

            try {
                const imagesUrl = `https://api.sports-tracker.com/apiserver/v1/images/workout/${id}?token=${token}`;
                const imageApiResponse = await fetch(imagesUrl);
                if (imageApiResponse.ok) {
                    const imagesJson = await imageApiResponse.json();
                    const images = imagesJson.payload || [];
                    for (let j = 0; j < images.length; j++) {
                        let image = images[j];
                        let locX = image.location ? image.location.x : '0';
                        let locY = image.location ? image.location.y : '0';
                        let imgFilename = `${id}-${image.key}-${locX}-${locY}-${image.timestamp}.jpg`;
                        let imgUrl = `https://api.sports-tracker.com/apiserver/v1/image/scale/${image.key}.jpg?width=${image.width}&height=${image.height}`;
                        
                        bashScript += `curl -s -o "${id}/${imgFilename}" "${imgUrl}"\n`;
                    }
                }
            } catch (e) {
                console.error("Error fetching images for workout", id, e);
            }
        }
        
        console.log("=========================================");
        console.log("BASH SCRIPT (For Mac, Linux)");
        console.log("Save as: download-all-workouts.sh");
        console.log("Run with: chmod +x download-all-workouts.sh && ./download-all-workouts.sh");
        console.log("=========================================");
        console.log(bashScript);

    } catch (err) {
        console.error("An error occurred: ", err);
    }
})();
