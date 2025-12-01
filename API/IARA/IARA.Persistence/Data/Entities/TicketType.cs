using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("TypeName", Name = "UQ__TicketTy__D4E7DFA8A7EDAD5F", IsUnique = true)]
public partial class TicketType
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string TypeName { get; set; } = null!;

    public int ValidityDays { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal PriceUnder14 { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal PriceAdult { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal PricePensioner { get; set; }

    public bool IsFreeForDisabled { get; set; }

    [InverseProperty("TicketType")]
    public virtual ICollection<TicketPurchase> TicketPurchases { get; set; } = new List<TicketPurchase>();
}
