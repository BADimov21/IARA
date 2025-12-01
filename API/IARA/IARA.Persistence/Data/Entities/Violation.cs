using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("InspectionId", Name = "IX_Violations_InspectionId")]
public partial class Violation
{
    [Key]
    public int Id { get; set; }

    public int InspectionId { get; set; }

    [StringLength(500)]
    public string Description { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal FineAmount { get; set; }

    [ForeignKey("InspectionId")]
    [InverseProperty("Violations")]
    public virtual Inspection Inspection { get; set; } = null!;
}
