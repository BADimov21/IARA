using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("TripId", Name = "IX_FishingOps_TripId")]
public partial class FishingOperation
{
    [Key]
    public int Id { get; set; }

    public int TripId { get; set; }

    public int FishingGearId { get; set; }

    public DateTime StartDateTime { get; set; }

    public DateTime? EndDateTime { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    [InverseProperty("Operation")]
    public virtual ICollection<Catch> Catches { get; set; } = new List<Catch>();

    [ForeignKey("FishingGearId")]
    [InverseProperty("FishingOperations")]
    public virtual FishingGear FishingGear { get; set; } = null!;

    [ForeignKey("TripId")]
    [InverseProperty("FishingOperations")]
    public virtual FishingTrip Trip { get; set; } = null!;
}
