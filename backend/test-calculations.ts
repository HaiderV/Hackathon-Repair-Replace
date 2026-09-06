import { calculateRepairReplace } from "./src/services/repair-replace-calculations.service.js";
import type { RepairReplaceAnalysisResult } from "./src/services/repair-replace-analysis.service.js";

const aiResult: RepairReplaceAnalysisResult = {
    "repair": {
        "possible": true,
        "difficulty": {
            "score": 40,
            "level": "moderate"
        },
        "cost": {
            "materials": {
                "min": 100,
                "max": 300,
                "average": 200
            },
            "tools": {
                "min": 150,
                "max": 400,
                "average": 275
            },
            "professionalLabor": {
                "min": 150,
                "max": 500,
                "average": 325
            }
        },
        "time": {
            "minMinutes": 15,
            "maxMinutes": 60,
            "averageMinutes": 38
        },
        "tools": [
            {
                "name": "Needle-nose pliers",
                "required": true,
                "estimatedPrice": {
                    "min": 150,
                    "max": 400,
                    "average": 275
                }
            },
            {
                "name": "Seam ripper",
                "required": false,
                "estimatedPrice": {
                    "min": 50,
                    "max": 150,
                    "average": 100
                }
            }
        ],
        "materials": [
            {
                "name": "Zipper Slider Replacement Kit (matching size and type)",
                "required": true,
                "estimatedPrice": {
                    "min": 100,
                    "max": 300,
                    "average": 200
                }
            }
        ],
        "steps": [
            "Identify the zipper type (coil, plastic, metal) and size (number on the back of the old slider) to purchase the correct replacement slider.",
            "If the existing zipper stops at the top of the zipper are intact, carefully use the pliers to open them and remove the broken slider. If missing or damaged, proceed to next step.",
            "If there are no existing stops or you need to access the zipper teeth, use a seam ripper to carefully remove a few stitches on the fabric at the top of one side of the zipper tape, just above where the teeth start. This creates an opening to slide the new slider onto the teeth.",
            "Slide the new zipper slider onto the zipper teeth from the side where you created an opening or removed the old stops. Ensure both sides of the zipper teeth are properly aligned inside the slider.",
            "Test the slider to ensure it moves smoothly along the zipper teeth and closes them correctly. If not, remove and re-align.",
            "Once the slider is correctly installed and working, crimp new zipper stops onto the top of the zipper tape using the needle-nose pliers, or sew the opened fabric back together to prevent the slider from coming off. Ensure the stops are securely fastened.",
            "Test the zipper again to confirm full functionality and that the slider does not come off."
        ]
    },
    "replacement": {
        "possible": true,
        "cost": {
            "min": 800,
            "max": 5000,
            "average": 2900
        },
        "time": {
            "minDays": 1,
            "maxDays": 5,
            "averageDays": 3
        },
        "reason": "The backpack's primary function is to carry items, and a broken zipper compromises its utility, making replacement a viable option."
    },
    "safety": {
        "score": 15,
        "level": "low",
        "warning": "Exercise caution when using sharp tools like a seam ripper or pliers to avoid pinching fingers or minor cuts."
    }
};

const result = calculateRepairReplace(aiResult);

console.log(JSON.stringify(result, null, 2));