using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrackerController : ControllerBase
    {
        private readonly TrackerService _trackerService;

        public TrackerController(IConfiguration configuration)
        {
            _trackerService = new TrackerService(configuration);
        }

        // POST: api/Tracker/GetAllDays
        [HttpGet("GetAllDays")]
        public IActionResult GetAllDays()
        {
            var result = _trackerService.GetAllDays();
            return Ok(result);
        }

        // GET: api/Tracker/UpdateDay
        [HttpPut("UpdateDay")]
        public IActionResult UpdateDay([FromBody] DayTrackerModel dayTrackerModel)
        {
            var workouts = _trackerService.UpdateDay(dayTrackerModel);
            return Ok(workouts);
        }
    }
}