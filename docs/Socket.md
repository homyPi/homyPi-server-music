# Actions

## Player

*	**player:resume**:   
    ```  
    Arguments = {  
            name: String //Player name  
    }  
    ```
    Resume current track

*	**player:pause**:  
    ```  
    Arguments = {  
            name: String //Player name  
    }  
    ```
    Pause current track

*	**player:next**:  
    ```  
    Arguments = {  
            name: String //Player name  
    }  
    ```
    Play next track in trackset

*	**player:previous**:  
    ```  
    Arguments = {  
            name: String //Player name  
    }  
    ```
    Play previous track in trackset

*	**player:play:track**:  
    ```  
    Arguments = {  
            player: {
                name: String //Player name  
            },
            track: Track object
    }  
    ```
    Play a track

# Events

*   **playlist:track:clear**: Playlist emptied
    ```  
    data = {  
            raspberry: String // Raspberry name
    }  
    ```

*   **playlist:track:added**: New track in playlist
    ```  
    data = {  
            // One of track or trackset
            track: Track object,
            trackset: Array of Track object
    }  
    ```
