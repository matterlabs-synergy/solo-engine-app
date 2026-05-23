import sys
import json
import os
from moviepy.editor import VideoFileClip

def process_video(video_input_path, output_path, start_time, end_time):
    try:
        # 1. Load the raw horizontal clip
        clip = VideoFileClip(video_input_path)
        
        # 2. Extract the high-retention time block based on tool timestamps
        sub_clip = clip.subclip(start_time, end_time)
        
        # 3. Calculate 9:16 vertical crop coordinates from 16:9 original specs
        orig_w, orig_h = sub_clip.size
        target_w = int(orig_h * (9 / 16))
        
        x1 = (orig_w - target_w) // 2
        y1 = 0
        x2 = x1 + target_w
        y2 = orig_h
        
        # 4. Execute the cropping boundaries transformation matrix
        cropped_clip = sub_clip.crop(x1=x1, y1=y1, x2=x2, y2=y2)
        
        # 5. Render out the clean production asset natively via FFmpeg
        cropped_clip.write_videofile(
            output_path, 
            codec="libx264", 
            audio_codec="aac", 
            bitrate="2000k",
            threads=4,
            logger=None
        )
        
        # Close file handles securely to prevent RAM server leaks
        clip.close()
        cropped_clip.close()
        return True
    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Handle streaming system arguments securely passed from the Node interface layer
    input_data = sys.stdin.read()
    params = json.loads(input_data)
    
    video_url = params.get("video_url")
    output_filename = params.get("output_name", "output_short.mp4")
    start = float(params.get("start", 0))
    end = float(params.get("end", 30))
    
    # Run pipeline loop execution 
    success = process_video(video_url, output_filename, start, end)
    
    if success:
        print(json.stringify({"success": True, "file_path": output_filename}))
    else:
        sys.exit(1)
