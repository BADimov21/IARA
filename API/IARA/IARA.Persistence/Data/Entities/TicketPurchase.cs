using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("PersonId", Name = "IX_TicketPurchases_PersonId")]
[Index("TicketNumber", Name = "UQ__TicketPu__CBED06DA55E2E47D", IsUnique = true)]
public partial class TicketPurchase
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string TicketNumber { get; set; } = null!;

    public int TicketTypeId { get; set; }

    public int PersonId { get; set; }

    public DateOnly PurchaseDate { get; set; }

    public DateOnly ValidFrom { get; set; }

    public DateOnly ValidUntil { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal PricePaid { get; set; }

    public int? TELKDecisionId { get; set; }

    [InverseProperty("TicketPurchase")]
    public virtual ICollection<Inspection> Inspections { get; set; } = new List<Inspection>();

    [ForeignKey("PersonId")]
    [InverseProperty("TicketPurchases")]
    public virtual Person Person { get; set; } = null!;

    [InverseProperty("TicketPurchase")]
    public virtual ICollection<RecreationalCatch> RecreationalCatches { get; set; } = new List<RecreationalCatch>();

    [ForeignKey("TELKDecisionId")]
    [InverseProperty("TicketPurchases")]
    public virtual TELKDecision? TELKDecision { get; set; }

    [ForeignKey("TicketTypeId")]
    [InverseProperty("TicketPurchases")]
    public virtual TicketType TicketType { get; set; } = null!;
}
