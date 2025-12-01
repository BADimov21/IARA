using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("DepartureDateTime", Name = "IX_FishingTrips_DepartureDateTime")]
[Index("VesselId", Name = "IX_FishingTrips_VesselId")]
public partial class FishingTrip
{
    [Key]
    public int Id { get; set; }

    public int VesselId { get; set; }

    public int PermitId { get; set; }

    public DateTime DepartureDateTime { get; set; }

    [StringLength(100)]
    public string DeparturePort { get; set; } = null!;

    public DateTime? ArrivalDateTime { get; set; }

    [StringLength(100)]
    public string? ArrivalPort { get; set; }

    [Column(TypeName = "numeric(17, 6)")]
    public decimal? DurationHours { get; set; }

    [InverseProperty("Trip")]
    public virtual ICollection<FishingOperation> FishingOperations { get; set; } = new List<FishingOperation>();

    [InverseProperty("Trip")]
    public virtual ICollection<Landing> Landings { get; set; } = new List<Landing>();

    [ForeignKey("PermitId")]
    [InverseProperty("FishingTrips")]
    public virtual FishingPermit Permit { get; set; } = null!;

    [ForeignKey("VesselId")]
    [InverseProperty("FishingTrips")]
    public virtual Vessel Vessel { get; set; } = null!;
}
