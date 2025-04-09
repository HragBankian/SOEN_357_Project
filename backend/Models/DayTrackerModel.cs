using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class DayTrackerModel
    {
        public int id { get; set; }
        [Required]
        public string day_of_week { get; set; }
        public double? bodyweight { get; set; }
        public bool? workout_is_complete { get; set; }
    }
}
