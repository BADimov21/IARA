using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("BatchCode", Name = "IX_FishBatches_BatchCode")]
[Index("LandingId", Name = "IX_FishBatches_LandingId")]
[Index("BatchCode", Name = "UQ__FishBatc__B22ADA8E3830D45A", IsUnique = true)]
public partial class FishBatch
{
    [Key]
    public int Id { get; set; }

    public int LandingId { get; set; }

    public int SpeciesId { get; set; }

    [StringLength(50)]
    public string BatchCode { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal WeightKg { get; set; }

    [InverseProperty("Batch")]
    public virtual ICollection<BatchLocation> BatchLocations { get; set; } = new List<BatchLocation>();

    [InverseProperty("Batch")]
    public virtual ICollection<Inspection> Inspections { get; set; } = new List<Inspection>();

    [ForeignKey("LandingId")]
    [InverseProperty("FishBatches")]
    public virtual Landing Landing { get; set; } = null!;

    [ForeignKey("SpeciesId")]
    [InverseProperty("FishBatches")]
    public virtual FishSpecy Species { get; set; } = null!;
}
