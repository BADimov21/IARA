using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

public partial class FishingGear
{
    [Key]
    public int Id { get; set; }

    public int GearTypeId { get; set; }

    public int? MeshSize { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? Length { get; set; }

    [InverseProperty("FishingGear")]
    public virtual ICollection<FishingOperation> FishingOperations { get; set; } = new List<FishingOperation>();

    [ForeignKey("GearTypeId")]
    [InverseProperty("FishingGears")]
    public virtual FishingGearType GearType { get; set; } = null!;

    [ForeignKey("FishingGearId")]
    [InverseProperty("FishingGears")]
    public virtual ICollection<FishingPermit> Permits { get; set; } = new List<FishingPermit>();
}
