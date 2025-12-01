using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("PersonId", Name = "IX_TELK_PersonId")]
[Index("DecisionNumber", Name = "UQ__TELKDeci__BB11758214FDB233", IsUnique = true)]
public partial class TELKDecision
{
    [Key]
    public int Id { get; set; }

    public int PersonId { get; set; }

    [StringLength(50)]
    public string DecisionNumber { get; set; } = null!;

    public DateOnly IssueDate { get; set; }

    public DateOnly? ValidUntil { get; set; }

    [ForeignKey("PersonId")]
    [InverseProperty("TELKDecisions")]
    public virtual Person Person { get; set; } = null!;

    [InverseProperty("TELKDecision")]
    public virtual ICollection<TicketPurchase> TicketPurchases { get; set; } = new List<TicketPurchase>();
}
