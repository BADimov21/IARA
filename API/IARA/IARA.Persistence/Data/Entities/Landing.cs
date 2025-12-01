using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("TripId", Name = "IX_Landings_TripId")]
public partial class Landing
{
    [Key]
    public int Id { get; set; }

    public int TripId { get; set; }

    public DateTime LandingDateTime { get; set; }

    [StringLength(100)]
    public string Port { get; set; } = null!;

    [InverseProperty("Landing")]
    public virtual ICollection<FishBatch> FishBatches { get; set; } = new List<FishBatch>();

    [ForeignKey("TripId")]
    [InverseProperty("Landings")]
    public virtual FishingTrip Trip { get; set; } = null!;
}
