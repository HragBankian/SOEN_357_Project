using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class WorkoutModel
    {
        public int id { get; set; }

        [Required]
        public string day_of_week { get; set; }

        public string? exercise_1 { get; set; }
        public int? weight_1 { get; set; }
        public int? sets_1 { get; set; }
        public int? reps_1 { get; set; }

        public string? exercise_2 { get; set; }
        public int? weight_2 { get; set; }
        public int? sets_2 { get; set; }
        public int? reps_2 { get; set; }

        public string? exercise_3 { get; set; }
        public int? weight_3 { get; set; }
        public int? sets_3 { get; set; }
        public int? reps_3 { get; set; }

        public string? exercise_4 { get; set; }
        public int? weight_4 { get; set; }
        public int? sets_4 { get; set; }
        public int? reps_4 { get; set; }

        public string? exercise_5 { get; set; }
        public int? weight_5 { get; set; }
        public int? sets_5 { get; set; }
        public int? reps_5 { get; set; }

        public string? exercise_6 { get; set; }
        public int? weight_6 { get; set; }
        public int? sets_6 { get; set; }
        public int? reps_6 { get; set; }
    }
}
