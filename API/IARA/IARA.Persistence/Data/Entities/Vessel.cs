using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("InternationalNumber", Name = "IX_Vessels_InternationalNumber")]
[Index("OwnerId", Name = "IX_Vessels_Owner")]
[Index("InternationalNumber", Name = "UQ__Vessels__0D0EED16EF482DAE", IsUnique = true)]
public partial class Vessel
{
    [Key]
    public int Id { get; set; }

    [StringLength(20)]
    public string InternationalNumber { get; set; } = null!;

    [StringLength(50)]
    public string CallSign { get; set; } = null!;

    [StringLength(100)]
    public string VesselName { get; set; } = null!;

    [Column(TypeName = "decimal(6, 2)")]
    public decimal Length { get; set; }

    [Column(TypeName = "decimal(6, 2)")]
    public decimal Width { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal GrossTonnage { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal EnginePower { get; set; }

    public int EngineTypeId { get; set; }

    public int OwnerId { get; set; }

    public int CaptainId { get; set; }

    [ForeignKey("CaptainId")]
    [InverseProperty("VesselCaptains")]
    public virtual Person Captain { get; set; } = null!;

    [ForeignKey("EngineTypeId")]
    [InverseProperty("Vessels")]
    public virtual EngineType EngineType { get; set; } = null!;

    [InverseProperty("Vessel")]
    public virtual ICollection<FishingPermit> FishingPermits { get; set; } = new List<FishingPermit>();

    [InverseProperty("Vessel")]
    public virtual ICollection<FishingTrip> FishingTrips { get; set; } = new List<FishingTrip>();

    [InverseProperty("Vessel")]
    public virtual ICollection<Inspection> Inspections { get; set; } = new List<Inspection>();

    [ForeignKey("OwnerId")]
    [InverseProperty("VesselOwners")]
    public virtual Person Owner { get; set; } = null!;
}
