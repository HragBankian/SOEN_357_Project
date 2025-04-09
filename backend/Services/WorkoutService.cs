using Dapper;
using backend.Models;
using MySql.Data.MySqlClient;

public interface IWorkoutService
{
    WorkoutModel AddWorkout(WorkoutModel workout);
    void DeleteAllWorkouts();
    IEnumerable<WorkoutModel> GetAllWorkouts();
}

public class WorkoutService : IWorkoutService
{
    private readonly IConfiguration _configuration;

    public WorkoutService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public WorkoutModel AddWorkout(WorkoutModel workout)
    {
        string sql = @"
            INSERT INTO Workouts (
                day_of_week,
                exercise_1, weight_1, sets_1, reps_1,
                exercise_2, weight_2, sets_2, reps_2,
                exercise_3, weight_3, sets_3, reps_3,
                exercise_4, weight_4, sets_4, reps_4,
                exercise_5, weight_5, sets_5, reps_5,
                exercise_6, weight_6, sets_6, reps_6
            ) VALUES (
                @day_of_week,
                @exercise_1, @weight_1, @sets_1, @reps_1,
                @exercise_2, @weight_2, @sets_2, @reps_2,
                @exercise_3, @weight_3, @sets_3, @reps_3,
                @exercise_4, @weight_4, @sets_4, @reps_4,
                @exercise_5, @weight_5, @sets_5, @reps_5,
                @exercise_6, @weight_6, @sets_6, @reps_6
            );
            SELECT LAST_INSERT_ID();";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        int newId = connection.ExecuteScalar<int>(sql, workout);
        workout.id = newId;

        return workout;
    }

    public void DeleteAllWorkouts()
    {
        string sql = "DELETE FROM Workouts";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        connection.Execute(sql);
    }

    public IEnumerable<WorkoutModel> GetAllWorkouts()
    {
        string sql = "SELECT * FROM Workouts";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.Query<WorkoutModel>(sql).ToList();
    }
}
