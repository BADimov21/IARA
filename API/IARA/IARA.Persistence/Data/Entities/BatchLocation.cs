using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("BatchId", Name = "IX_BatchLocations_BatchId")]
public partial class BatchLocation
{
    [Key]
    public int Id { get; set; }

    public int BatchId { get; set; }

    [StringLength(50)]
    public string LocationType { get; set; } = null!;

    [StringLength(200)]
    public string LocationName { get; set; } = null!;

    public DateTime ArrivedAt { get; set; }

    public DateTime? DepartedAt { get; set; }

    [ForeignKey("BatchId")]
    [InverseProperty("BatchLocations")]
    public virtual FishBatch Batch { get; set; } = null!;
}
