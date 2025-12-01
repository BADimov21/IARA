using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("OperationId", Name = "IX_Catches_OperationId")]
public partial class Catch
{
    [Key]
    public int Id { get; set; }

    public int OperationId { get; set; }

    public int SpeciesId { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal WeightKg { get; set; }

    [ForeignKey("OperationId")]
    [InverseProperty("Catches")]
    public virtual FishingOperation Operation { get; set; } = null!;

    [ForeignKey("SpeciesId")]
    [InverseProperty("Catches")]
    public virtual FishSpecy Species { get; set; } = null!;
}
