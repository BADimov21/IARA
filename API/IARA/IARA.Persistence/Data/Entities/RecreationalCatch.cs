using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("CatchDateTime", Name = "IX_RecCatches_CatchDateTime")]
[Index("PersonId", Name = "IX_RecCatches_PersonId")]
public partial class RecreationalCatch
{
    [Key]
    public int Id { get; set; }

    public int TicketPurchaseId { get; set; }

    public int PersonId { get; set; }

    public int SpeciesId { get; set; }

    public DateTime CatchDateTime { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal WeightKg { get; set; }

    [ForeignKey("PersonId")]
    [InverseProperty("RecreationalCatches")]
    public virtual Person Person { get; set; } = null!;

    [ForeignKey("SpeciesId")]
    [InverseProperty("RecreationalCatches")]
    public virtual FishSpecy Species { get; set; } = null!;

    [ForeignKey("TicketPurchaseId")]
    [InverseProperty("RecreationalCatches")]
    public virtual TicketPurchase TicketPurchase { get; set; } = null!;
}
