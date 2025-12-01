using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("SpeciesName", Name = "UQ__FishSpec__304D4C0DADCFB3B4", IsUnique = true)]
public partial class FishSpecy
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string SpeciesName { get; set; } = null!;

    [InverseProperty("Species")]
    public virtual ICollection<Catch> Catches { get; set; } = new List<Catch>();

    [InverseProperty("Species")]
    public virtual ICollection<FishBatch> FishBatches { get; set; } = new List<FishBatch>();

    [InverseProperty("Species")]
    public virtual ICollection<RecreationalCatch> RecreationalCatches { get; set; } = new List<RecreationalCatch>();
}
