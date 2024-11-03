export function EvaluateStations(totalStations:number, metroStations:number, nightStations:number){
    var final_score=totalStations;
    final_score=final_score+metroStations*5;//Metro Stations Counts five
    final_score=final_score+nightStations*2;//Night Bus connection counts 2
    return final_score;
}  