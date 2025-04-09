using Dapper;
using backend.Models;
using MySql.Data.MySqlClient;

public interface ITrackerService
{
    public DayTrackerModel UpdateDay(DayTrackerModel day);
    IEnumerable<DayTrackerModel> GetAllDays();
}

public class TrackerService : ITrackerService
{
    private readonly IConfiguration _configuration;

    public TrackerService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public IEnumerable<DayTrackerModel> GetAllDays()
    {
        string sql = "SELECT * FROM Tracker";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.Query<DayTrackerModel>(sql).ToList();
    }
    public DayTrackerModel UpdateDay(DayTrackerModel day)
    {
        string sql = @"
        UPDATE Tracker SET
            bodyweight = @bodyweight,
            workout_is_complete = @workout_is_complete
        WHERE day_of_week = @day_of_week;
    ";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        connection.Execute(sql, day);

        return day;
    }

}
