using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutController : ControllerBase
    {
        private readonly WorkoutService _workoutService;

        public WorkoutController(IConfiguration configuration)
        {
            _workoutService = new WorkoutService(configuration);
        }

        // POST: api/Workout/AddWorkout
        [HttpPost("AddWorkout")]
        public IActionResult AddWorkout([FromBody] WorkoutModel workout)
        {
            var result = _workoutService.AddWorkout(workout);
            return Ok(result);
        }

        // DELETE: api/Workout/DeleteAll
        [HttpDelete("DeleteAll")]
        public IActionResult DeleteAll()
        {
            _workoutService.DeleteAllWorkouts();
            return Ok("All workouts have been deleted.");
        }

        // GET: api/Workout/GetAll
        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var workouts = _workoutService.GetAllWorkouts();
            return Ok(workouts);
        }
    }
}
