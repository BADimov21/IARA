using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("ValidUntil", Name = "IX_FishingPermits_ValidUntil")]
[Index("VesselId", Name = "IX_FishingPermits_VesselId")]
[Index("PermitNumber", Name = "UQ__FishingP__DA3C94EED997A6A2", IsUnique = true)]
public partial class FishingPermit
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string PermitNumber { get; set; } = null!;

    public int VesselId { get; set; }

    public DateOnly IssueDate { get; set; }

    public DateOnly ValidFrom { get; set; }

    public DateOnly ValidUntil { get; set; }

    public bool IsRevoked { get; set; }

    [InverseProperty("Permit")]
    public virtual ICollection<FishingTrip> FishingTrips { get; set; } = new List<FishingTrip>();

    [ForeignKey("VesselId")]
    [InverseProperty("FishingPermits")]
    public virtual Vessel Vessel { get; set; } = null!;

    [ForeignKey("PermitId")]
    [InverseProperty("Permits")]
    public virtual ICollection<FishingGear> FishingGears { get; set; } = new List<FishingGear>();
}
